require("dotenv").config();
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const isWindows = process.platform === "win32";
const logFile = path.resolve(__dirname, "sync.log");

function log(message) {
  const timestamp = new Date().toISOString();
  const fullMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFile, fullMessage, "utf8");
  console.log(fullMessage.trim());
}

function toWSLPath(winPath) {
  const driveLetter = winPath[0].toLowerCase();
  const rest = winPath.slice(2).replace(/\\/g, "/");
  return `/mnt/${driveLetter}${rest}`;
}

function validatePath(name, value) {
  if (!value) throw new Error(`❌ Missing path ${name} in .env`);
  if (isWindows && !/^[a-zA-Z]:\\/.test(value)) {
    throw new Error(
      `❌ Path ${name} must be absolute Windows format: "${value}"`,
    );
  }
  if (!isWindows && !path.isAbsolute(value)) {
    throw new Error(
      `❌ Path ${name} must be absolute (Linux/macOS): "${value}"`,
    );
  }
}

function runRsync(srcPath, destPath) {
  return new Promise((resolve, reject) => {
    const src = isWindows
      ? toWSLPath(path.resolve(srcPath))
      : path.resolve(srcPath);
    const dest = isWindows
      ? toWSLPath(path.resolve(destPath))
      : path.resolve(destPath);

    const rsyncArgs = ["-a", "--progress", `${src}/`, `${dest}/`];

    const rsyncProcess = isWindows
      ? spawn("wsl", ["rsync", ...rsyncArgs])
      : spawn("rsync", rsyncArgs);

    log(`🔄 Sync started:\nFROM: ${srcPath}\nTO: ${destPath}`);

    rsyncProcess.stdout.on("data", (data) => {
      process.stdout.write(data.toString());
    });

    rsyncProcess.stderr.on("data", (data) => {
      const text = data.toString();
      process.stderr.write(text);
      fs.appendFileSync(logFile, `[stderr] ${text}`, "utf8");
    });

    rsyncProcess.on("close", (code) => {
      if (code === 0) {
        log(`✅ Sync finished successfully for ${srcPath}`);
        resolve();
      } else {
        const errMsg = `❌ Sync exited with code ${code} for ${srcPath}`;
        log(errMsg);
        reject(new Error(errMsg));
      }
    });
  });
}

(async () => {
  try {
    const srcDIST = process.env.BLOG_DIR_DIST;
    const srcIMAGES = process.env.BLOG_DIR_IMAGES;
    const srcFAVICONS = process.env.BLOG_DIR_FAVICONS;
    const destRAW = process.env.BLOG_DIR_DEST;

    validatePath("BLOG_DIR_DIST", srcDIST);
    validatePath("BLOG_DIR_IMAGES", srcIMAGES);
    validatePath("BLOG_DIR_FAVICONS", srcFAVICONS);
    validatePath("BLOG_DIR_DEST", destRAW);

    // Sync dist do root DEST
    await runRsync(srcDIST, destRAW);

    // Sync images do DEST/images
    await runRsync(srcIMAGES, path.join(destRAW, "images"));

    // Sync favicons do DEST/favicons
    await runRsync(srcFAVICONS, path.join(destRAW, "favicons"));

    log("🎉 All syncs completed successfully.");
  } catch (e) {
    log(`❌ Critical error: ${e.message}`);
  }
})();
