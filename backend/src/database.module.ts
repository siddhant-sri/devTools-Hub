import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        if (process.env.MONGODB_URI) {
          console.log('📡 Connecting to MongoDB cluster from .env!');
          return { uri: process.env.MONGODB_URI };
        }

        console.log('⚠️ No MONGODB_URI provided in .env, booting up temporary memo ry server...');
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        console.log(`🚀 Memory MongoDB attached at ${uri}`);
        return {
          uri: uri,
        };
      },
    }),
  ],
})
export class DatabaseModule { }
