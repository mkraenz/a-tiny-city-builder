/** Get the center of a GameObject with origin=(0,0) */
export const atCenter = ({
    x,
    y,
    width,
    height,
    scale,
}: {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
}) => {
    return { x: x + (width * scale) / 2, y: y + (height * scale) / 2 };
};
