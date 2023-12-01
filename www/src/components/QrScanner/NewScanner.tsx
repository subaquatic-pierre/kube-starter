import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { Html5Qrcode } from 'html5-qrcode';
import { Html5QrcodeScanner } from 'html5-qrcode';

const Scanner = ({ handleScan, handleError }) => {
  const videoRef = useRef<HTMLDivElement>();
  const [loaded, setLoaded] = useState(false);
  const scannerRef = useRef<any>();

  const handleInit = async () => {
    scannerRef.current = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        videoConstraints: {
          facingMode: 'environment',
        },
      },
      false,
    );
    // scannerRef.current = new Html5Qrcode('reader');
    setLoaded(true);
  };

  const handleRender = async () => {
    if (loaded) {
      const scanner = scannerRef.current;
      scanner.render(handleScan, handleError);
      // const cameras = await Html5Qrcode.getCameras();

      // if (cameras && cameras.length) {
      // var cameraId = cameras[0].id;
      //
      // await scanner.start(
      //   cameraId,
      //   {
      //     fps: 2, // Optional, frame per seconds for qr code scanning
      //     qrbox: { width: 300, height: 300 }, // Optional, if you want bounded box UI
      //   },
      //   handleScan,
      //   handleError,
      // );
      // }
    }
  };

  useEffect(() => {
    handleRender();
  }, [loaded]);

  useEffect(() => {
    handleInit();

    return () => {
      // const el = document.getElementById('reader');
      // if (el) {
      //   window.document.removeChild(el);
      // }
      scannerRef.current.clear();
    };
  }, []);

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        height: 400,
        '& video': {
          height: 300,
          objectFit: 'cover',
        },
        // '& span': {
        //   display: 'none !important',
        // },
        '& #reader__dashboard_section': {
          // '& span': {
          //   display: 'none',
          // },
        },
        '& .reader': {
          border: 'none !important',
          '& button': {
            '&:hover': {
              cursor: 'pointer',
            },
            outline: 'none',
            border: 'none',
            p: 2,
            borderRadius: '4px',
            backgroundColor: theme.palette.primary.main,
            color: 'white',
          },

          '& img': {
            display: 'none',
          },
        },
      })}
    >
      <div id="reader" className="reader" style={{ width: 300 }} />
    </Box>
  );
};

export default Scanner;
