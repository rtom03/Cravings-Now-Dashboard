// // services/locationService.ts
// import { prisma } from "../utils/db";

// export interface NearestBranchResult {
//   branchId: string;
//   distanceKm: number;
// }

// /**
//  * Finds the single nearest branch to a customer's coordinates using the
//  * Haversine formula (great-circle distance on a sphere) — the standard
//  * approach for "nearest location" lookups at this scale. Computed directly
//  * in SQL so we don't have to pull every branch row into Node just to sort
//  * them.
//  */
// export async function findNearestBranch(
//   latitude: number,
//   longitude: number,
// ): Promise<NearestBranchResult> {
//   const result = await prisma.$queryRaw<
//     Array<{ id: string; distance_km: number }>
//   >`
//     SELECT
//       id,
//       (
//         6371 * acos(
//           cos(radians(${latitude})) * cos(radians(latitude)) *
//           cos(radians(longitude) - radians(${longitude})) +
//           sin(radians(${latitude})) * sin(radians(latitude))
//         )
//       ) AS distance_km
//     FROM branches
//     WHERE latitude IS NOT NULL AND longitude IS NOT NULL
//     ORDER BY distance_km ASC
//     LIMIT 1;
//   `;

//   if (result.length === 0) {
//     throw new Error("No branches with coordinates available");
//   }

//   return { branchId: result[0].id, distanceKm: result[0].distance_km };
// }
import { prisma } from "../utils/db";

export interface NearestBranchResult {
  branchId: string;
  distanceKm: number;
}

export async function findNearestBranch(
  latitude: number,
  longitude: number,
): Promise<NearestBranchResult> {
  const result = await prisma.$queryRaw<
    Array<{
      id: string;
      distance_km: number;
    }>
  >`
    SELECT
      id,
      (
        6371 * acos(
          LEAST(
            1.0,
            GREATEST(
              -1.0,
              cos(radians(${latitude}::double precision))
              * cos(radians(latitude::double precision))
              * cos(
                radians(longitude::double precision)
                - radians(${longitude}::double precision)
              )
              + sin(radians(${latitude}::double precision))
              * sin(radians(latitude::double precision))
            )
          )
        )
      ) AS distance_km
    FROM branches
    WHERE latitude IS NOT NULL
      AND longitude IS NOT NULL
    ORDER BY distance_km ASC
    LIMIT 1
  `;

  if (result.length === 0) {
    throw new Error("No branches with coordinates available");
  }

  return {
    branchId: result[0].id,
    distanceKm: Number(result[0].distance_km),
  };
}
