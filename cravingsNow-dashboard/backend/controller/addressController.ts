import { Request, Response } from "express";
import { prisma } from "../utils/db";

// TODO: adjust to however your auth middleware actually attaches the
// authenticated customer to the request — assuming req.user.id for now.
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

interface CreateAddressBody {
  name?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  deliveryZoneId?: string;
}

export async function createAddress(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const customerId = req.user?.id;

    if (!customerId) {
      res.status(401).json({ error: "Not authenticated." });
      return;
    }

    const { name, description, latitude, longitude, deliveryZoneId } =
      req.body as CreateAddressBody;

    // Every field on the model besides customerId is nullable, but an
    // address with only one of latitude/longitude set isn't usable for
    // delivery either way — require them together if either is given.
    if ((latitude && !longitude) || (longitude && !latitude)) {
      res
        .status(400)
        .json({ error: "latitude and longitude must be provided together." });
      return;
    }

    // TODO: deliveryZoneId is currently trusted as-is from the request
    // body. Ideally this gets derived server-side from latitude/longitude
    // via a zone-lookup service instead, so a customer can't claim a zone
    // they aren't actually in — left as a direct connect for now since
    // that lookup doesn't exist yet.
    const address = await prisma.customerAddress.create({
      data: {
        name,
        description,
        latitude,
        longitude,
        customer: { connect: { id: customerId } },
        deliveryZone: deliveryZoneId
          ? { connect: { id: deliveryZoneId } }
          : undefined,
      },
    });

    res.status(201).json({ address });
  } catch (error) {
    console.error("createAddress failed:", error);
    res.status(500).json({ error: "Failed to create address." });
  }
}
