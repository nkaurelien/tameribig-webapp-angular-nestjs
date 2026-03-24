import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface UploadResult {
  key: string;
  bucket: string;
  url: string;
  size: number;
  contentType: string;
}

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;
  private bucket: string;
  private endpoint: string;
  private publicUrl: string;

  async onModuleInit(): Promise<void> {
    this.endpoint = process.env.S3_ENDPOINT || 'http://localhost:9000';
    this.bucket = process.env.S3_BUCKET || 'tameri-bucket';
    this.publicUrl = process.env.S3_PUBLIC_URL || this.endpoint;

    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      region: process.env.S3_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
      },
      forcePathStyle: true,
    });

    await this.ensureBucketExists();
    this.logger.log(`Storage service initialized with bucket: ${this.bucket}`);
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      this.logger.log(`Creating bucket: ${this.bucket}`);
      await this.s3Client.send(
        new CreateBucketCommand({ Bucket: this.bucket }),
      );
    }
  }

  async upload(
    key: string,
    body: Buffer,
    contentType: string,
  ): Promise<UploadResult> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );

    return {
      key,
      bucket: this.bucket,
      url: this.getPublicUrl(key),
      size: body.length,
      contentType,
    };
  }

  async uploadFromMulter(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<UploadResult> {
    const timestamp = Date.now();
    const ext = file.originalname.split('.').pop();
    const key = `${folder}/${timestamp}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    return this.upload(key, file.buffer, file.mimetype);
  }

  async getSignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async getSignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn = 3600,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async delete(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async listFiles(prefix = '', limit = 100): Promise<string[]> {
    const response = await this.s3Client.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        MaxKeys: limit,
      }),
    );

    return (response.Contents || []).map((obj) => obj.Key);
  }

  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${this.bucket}/${key}`;
  }

  getImgproxyUrl(
    key: string,
    options: {
      width?: number;
      height?: number;
      resizing?: 'fit' | 'fill' | 'auto';
      format?: 'webp' | 'avif' | 'jpg' | 'png';
    } = {},
  ): string {
    const imgproxyUrl = process.env.IMGPROXY_URL || 'http://localhost:8080';
    const {
      width = 0,
      height = 0,
      resizing = 'fit',
      format = 'webp',
    } = options;

    const sourceUrl = `s3://${this.bucket}/${key}`;
    const encodedSource = Buffer.from(sourceUrl).toString('base64url');

    return `${imgproxyUrl}/insecure/rs:${resizing}:${width}:${height}/${encodedSource}.${format}`;
  }
}
