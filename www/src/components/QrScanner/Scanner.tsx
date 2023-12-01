import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import QrScanner from 'qr-scanner';

const Scanner = ({ handleScan, handleError }) => {
  const [started, setStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>();
  const scannerRef = useRef<any>();

  useEffect(() => {
    const scanner = new QrScanner(videoRef.current, handleScan, {
      onDecodeError: handleError,
      highlightScanRegion: true,
      highlightCodeOutline: true,
    });
    scanner.start();
    setStarted(true);
    scannerRef.current = scanner;
    return () => {
      scanner.stop();
    };
  }, []);

  const listConfig = async () => {
    if (scannerRef.current) {
      const scanner = scannerRef.current;
      console.log(scanner);
      const vals = await QrScanner.listCameras();
      console.log(vals);
    }
  };

  useEffect(() => {
    if (scannerRef.current) {
      listConfig();
    }
  }, [started]);

  return (
    <video
      ref={videoRef}
      style={{
        width: 300,
        height: 300,
        objectFit: 'cover',
      }}
      // sx={{
      //   height: { xs: 300, md: 600 },
      //   width: { xs: 300, md: 600 },
      //   objectFit: 'cover',
      // }}
    ></video>
  );
};

export default Scanner;
