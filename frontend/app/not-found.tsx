import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="mb-4 text-xl text-muted-foreground">Page Not Found</p>
            <Link href="/" className="text-primary hover:underline">
                Return Home
            </Link>
        </div>
    );
}
