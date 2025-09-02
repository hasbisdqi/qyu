import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import qz from 'qz-tray';
import { configureEcho } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

qz.security.setCertificatePromise(function (resolve, reject) {
  resolve(`-----BEGIN CERTIFICATE-----
MIIDATCCAemgAwIBAgIUYDc7pGFYa6MKgHGKTsFhYYluRhIwDQYJKoZIhvcNAQEL
BQAwEDEOMAwGA1UEAwwFTXlBcHAwHhcNMjUwOTAyMDI0MzA3WhcNMjYwOTAyMDI0
MzA3WjAQMQ4wDAYDVQQDDAVNeUFwcDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC
AQoCggEBAJ3V1RWjP6BumULfd8L843QvEE/G1kDyT9EZ0Lg8bnCHDahE+bZ2prWV
AMHYgjsRliKbZ9bfHeCPE+XCfQ8Qrr/a3u0zOOGi7phmnmL7Uk2q9cxobv0UWfCu
iiOG8MfbGWqflZH3qKGHkp0I9RYTENeBmWVOPAMlmJa5VWJcd0B08mmcC904dass
pz//x1l5zHMvvR/7Tix0CCm5zAzXTT8MI6xlL68I7fyipjSC/mPAewtAdvNffLQ7
1bGGEYr9uhzfAsFC0ENnFD5B3viOUue/U7XhYFmkM8fzcG8gxSNn9EtcJrtJfreG
XTrfyut1APV/HIYQuig8tBKZIKaOeasCAwEAAaNTMFEwHQYDVR0OBBYEFId4MkAs
g2tXTjQD3ZdxtWljZ2T7MB8GA1UdIwQYMBaAFId4MkAsg2tXTjQD3ZdxtWljZ2T7
MA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBADNHGvXqpe9OniRa
ecTX2ViARCYnvOnf41wz4Yenru5h8pEE/PybWdOUb2P7GnziEGH1tsmM6lQlyABo
sl1XJPHLh1957FMteE2uhoDHq0KKQgJA8+xFbm0xzT0BfApCN0/N6NQ7SRThv8zp
/zXGKAlMj2SDlu9xNSC8GxIgmJKFVwXns0WVwBP5mmlt/fcqqbDNVa40G9JrHo/1
CezHEkUaexxVoRJ3/FkXAYjnc05u7vUdjTmRF/HtHkKPIDzeXpATwAyWt148vniX
7PfB77yW0Yx9jgtcVk5xZSf7iyRCmeG30uHwm3HFvFhQjDX8lYPltbebw/p6CIyO
brElb/U=
-----END CERTIFICATE-----
`);
});

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
