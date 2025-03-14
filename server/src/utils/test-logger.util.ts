import fs from 'fs';
import path from 'path';

export class TestLogger {
  private static logDir = path.join(process.cwd(), 'logs');
  private static logFile = path.join(TestLogger.logDir, 'test-output.log');


  static initialize(): void {
    if (!fs.existsSync(TestLogger.logDir)) {
      fs.mkdirSync(TestLogger.logDir, { recursive: true });
    }

    fs.writeFileSync(TestLogger.logFile, `Test Run Started: ${new Date().toISOString()}\n\n`);
  }

  static log(message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    let logEntry = `[${timestamp}] ${message}`;
    
    if (data) {
      logEntry += `\n${JSON.stringify(data, null, 2)}`;
    }
    
    logEntry += '\n\n';
    
    fs.appendFileSync(TestLogger.logFile, logEntry);
  }
}

TestLogger.initialize();