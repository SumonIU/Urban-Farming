import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const UserRole = {
  ADMIN: "ADMIN",
  VENDOR: "VENDOR",
  CUSTOMER: "CUSTOMER",
} as const;

const UserStatus = {
  ACTIVE: "ACTIVE",
} as const;

const CertificationStatus = {
  VERIFIED: "VERIFIED",
  PENDING: "PENDING",
} as const;

const AvailabilityStatus = {
  RESERVED: "RESERVED",
  AVAILABLE: "AVAILABLE",
} as const;

const PlantHealthStatus = {
  GOOD: "GOOD",
} as const;

const hashPassword = (value: string) => bcrypt.hashSync(value, 10);

async function main() {
  await prisma.plantUpdate.deleteMany();
  await prisma.plant.deleteMany();
  await prisma.order.deleteMany();
  await prisma.rentalBooking.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.sustainabilityCert.deleteMany();
  await prisma.produce.deleteMany();
  await prisma.rentalSpace.deleteMany();
  await prisma.vendorProfile.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Platform Admin",
      email: "admin@urbanfarm.local",
      password: hashPassword("Password123!"),
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Customer One",
      email: "customer@urbanfarm.local",
      password: hashPassword("Password123!"),
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
    },
  });

  const vendorUsers = await Promise.all(
    Array.from({ length: 10 }).map((_, index) =>
      prisma.user.create({
        data: {
          name: `Vendor ${index + 1}`,
          email: `vendor${index + 1}@urbanfarm.local`,
          password: hashPassword("Password123!"),
          role: UserRole.VENDOR,
          status: UserStatus.ACTIVE,
        },
      }),
    ),
  );

  const vendorProfiles = await Promise.all(
    vendorUsers.map((user, index) =>
      prisma.vendorProfile.create({
        data: {
          userId: user.id,
          farmName: `Green Plot ${index + 1}`,
          certificationStatus:
            index % 2 === 0
              ? CertificationStatus.VERIFIED
              : CertificationStatus.PENDING,
          farmLocation: `District ${index + 1}, Metro City`,
          isApproved: index % 2 === 0,
        },
      }),
    ),
  );

  for (const [index, vendor] of vendorProfiles.entries()) {
    await prisma.sustainabilityCert.create({
      data: {
        vendorId: vendor.id,
        certifyingAgency: "Metro Organic Council",
        certificationDate: new Date(),
        documentUrl: `https://example.com/certificates/vendor-${index + 1}.pdf`,
        status:
          index % 2 === 0
            ? CertificationStatus.VERIFIED
            : CertificationStatus.PENDING,
      },
    });

    await prisma.rentalSpace.create({
      data: {
        vendorId: vendor.id,
        location: `Zone ${index + 1}, Metro City`,
        size: `${20 + index * 5} sqm`,
        price: 50 + index * 10,
        availability:
          index % 3 === 0
            ? AvailabilityStatus.RESERVED
            : AvailabilityStatus.AVAILABLE,
      },
    });

    await prisma.communityPost.create({
      data: {
        userId: customer.id,
        postContent: `Organic gardening tip #${index + 1}: rotate crops to maintain soil health.`,
      },
    });
  }

  const produceSeed = Array.from({ length: 100 }).map((_, index) => ({
    vendorId: vendorProfiles[index % vendorProfiles.length].id,
    name: `Produce Item ${index + 1}`,
    description: `Fresh, locally grown product ${index + 1}`,
    price: 3 + (index % 12) * 0.75,
    category:
      index % 3 === 0 ? "Vegetables" : index % 3 === 1 ? "Seeds" : "Tools",
    certificationStatus:
      index % 2 === 0
        ? CertificationStatus.VERIFIED
        : CertificationStatus.PENDING,
    availableQuantity: 10 + (index % 25),
  }));

  await prisma.produce.createMany({ data: produceSeed });

  const firstProduce = await prisma.produce.findFirst();
  const firstSpace = await prisma.rentalSpace.findFirst();

  if (firstProduce) {
    await prisma.order.create({
      data: {
        userId: customer.id,
        produceId: firstProduce.id,
        vendorId: firstProduce.vendorId,
        status: "PAID",
        quantity: 2,
      },
    });
  }

  if (firstSpace) {
    await prisma.rentalBooking.create({
      data: {
        userId: customer.id,
        rentalSpaceId: firstSpace.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: "PAID",
      },
    });
  }

  const plant = await prisma.plant.create({
    data: {
      userId: customer.id,
      vendorId: vendorProfiles[0].id,
      plantName: "Tomato Patch",
      species: "Tomato",
      healthStatus: PlantHealthStatus.GOOD,
      growthStage: "Vegetative",
      expectedHarvest: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.plantUpdate.create({
    data: {
      plantId: plant.id,
      note: "Initial transplant completed.",
      healthStatus: PlantHealthStatus.GOOD,
    },
  });

  console.log("Seed completed");
  console.log({
    admin: admin.email,
    customer: customer.email,
    vendors: vendorProfiles.length,
    products: produceSeed.length,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
