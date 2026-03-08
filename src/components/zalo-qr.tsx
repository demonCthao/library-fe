import { QRCodeSVG } from "qrcode.react";

export const ZaloPayQR = ({ url }: { url: string }) => {
    return (
        <div className="flex flex-col items-center gap-4">
            <h2>Scan with ZaloPay</h2>

            <QRCodeSVG
                value={url}
                size={220}
            />

            <p>Use ZaloPay app to scan</p>
        </div>
    );
};