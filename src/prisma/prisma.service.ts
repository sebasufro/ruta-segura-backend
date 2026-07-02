import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService implements OnModuleInit {
  private client: any;

  constructor() {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
  }

  async onModuleInit() {
    try {
      const { PrismaClient } = require('@prisma/client');
      const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
      this.client = new PrismaClient({ adapter });
      await this.client.$connect();
      console.log('Prisma connected successfully');
    } catch (error) {
      console.error('Failed to initialize Prisma:', error);
      throw error;
    }
  }

  get users() {
    return this.client?.users;
  }
  get organization() {
    return this.client?.organization;
  }
  get organization_documents() {
    return this.client?.organization_documents;
  }
  get emergency_contacts() {
    return this.client?.emergency_contacts;
  }
  get location_updates() {
    return this.client?.location_updates;
  }
  get route() {
    return this.client?.route;
  }
  get route_enrollment() {
    return this.client?.route_enrollment;
  }
  get user_addresses() {
    return this.client?.user_addresses;
  }

  $transaction(callback: (tx: any) => Promise<any>) {
    return this.client?.$transaction(callback);
  }

  $connect() {
    return this.client?.$connect();
  }

  $disconnect() {
    return this.client?.$disconnect();
  }
}
