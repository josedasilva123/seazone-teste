-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "bedroomQuantity" INTEGER NOT NULL,
    "bathroomQuantity" INTEGER NOT NULL,
    "guestCapacity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    CONSTRAINT "Address_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Operational" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wifiNetwork" TEXT NOT NULL,
    "wifiPassword" TEXT NOT NULL,
    "isSelfCheckin" BOOLEAN NOT NULL,
    "propertyAccessType" TEXT NOT NULL,
    "propertyAccessInstructions" TEXT NOT NULL,
    "propertyPassword" TEXT NOT NULL,
    "hasParkingSpot" BOOLEAN NOT NULL,
    "parkingSpotIdentifier" TEXT,
    "parkingSpotInstructions" TEXT,
    "propertyId" TEXT NOT NULL,
    CONSTRAINT "Operational_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PropertyRules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checkInTime" TEXT NOT NULL,
    "checkOutTime" TEXT NOT NULL,
    "allowPet" BOOLEAN NOT NULL,
    "smokingPermitted" BOOLEAN NOT NULL,
    "suitableForChildren" BOOLEAN NOT NULL,
    "suitableForBabies" BOOLEAN NOT NULL,
    "eventsPermitted" BOOLEAN NOT NULL,
    "propertyId" TEXT NOT NULL,
    CONSTRAINT "PropertyRules_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Amenities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wifi" BOOLEAN NOT NULL DEFAULT false,
    "tv" BOOLEAN NOT NULL DEFAULT false,
    "airConditioning" BOOLEAN NOT NULL DEFAULT false,
    "kitchen" BOOLEAN NOT NULL DEFAULT false,
    "washingMachine" BOOLEAN NOT NULL DEFAULT false,
    "elevator" BOOLEAN NOT NULL DEFAULT false,
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "bbqGrill" BOOLEAN NOT NULL DEFAULT false,
    "dishwasher" BOOLEAN NOT NULL DEFAULT false,
    "jacuzzi" BOOLEAN NOT NULL DEFAULT false,
    "pool" BOOLEAN NOT NULL DEFAULT false,
    "propertyId" TEXT NOT NULL,
    CONSTRAINT "Amenities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PropertyImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "propertyId" TEXT NOT NULL,
    CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Host" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    CONSTRAINT "Host_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LocalGuide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "welcomeMessage" TEXT NOT NULL,
    "seasonalTips" TEXT NOT NULL DEFAULT '',
    "propertyId" TEXT NOT NULL,
    CONSTRAINT "LocalGuide_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LocalGuidePlace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "placeType" TEXT,
    "distance" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    CONSTRAINT "LocalGuidePlace_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "LocalGuide" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_code_key" ON "Property"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Address_propertyId_key" ON "Address"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Operational_propertyId_key" ON "Operational"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyRules_propertyId_key" ON "PropertyRules"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Amenities_propertyId_key" ON "Amenities"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Host_propertyId_key" ON "Host"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "LocalGuide_propertyId_key" ON "LocalGuide"("propertyId");
