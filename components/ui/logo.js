import Image from "next/image";

export default function Logo({ size=40 }) {
    return (
        <Image src="/icon.svg" alt="icon" width={size} height={size} />
    );
}