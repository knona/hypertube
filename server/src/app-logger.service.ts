import { Injectable, LoggerService } from '@nestjs/common';
import { createWriteStream, WriteStream } from 'fs';

@Injectable()
export class AppLoggerService implements LoggerService {
  private fileStream: WriteStream = createWriteStream('log.txt', { flags: 'a' });

  private formatDate(): string {
    const date: Date = new Date();
    const hours: string = date.getHours().toString().padStart(2, '0');
    const minutes: string = date.getMinutes().toString().padStart(2, '0');
    const seconds: string = date.getSeconds().toString().padStart(2, '0');

    return `[${hours}:${minutes}:${seconds}]`;
  }

  private logToFile(message: string, context?: string): void {
    const text: string = `${this.formatDate()} ${context ? '[' + context + ']' : ''} : ${message}\n`;
    this.fileStream.write(text);
  }

  public log(message: any, context?: string): void {
    this.logToFile(message, context);
  }

  public error(message: any, _trace?: string, context?: string): void {
    this.logToFile(message, context);
  }

  public warn(message: any, context?: string): void {
    this.logToFile(message, context);
  }

  public debug?(message: any, context?: string): void {
    this.logToFile(message, context);
  }

  public verbose?(message: any, context?: string): void {
    this.logToFile(message, context);
  }
}
