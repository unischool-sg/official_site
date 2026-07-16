export function Hero() {
    return (
        <>
            <div className="flex flex-col items-center justify-center w-full mx-auto px-4 pt-16 sm:pt-26 text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium">
                    We are team of{" "}
                    <span className="bg-gradient-to-r from-green-900 to-green-950 bg-clip-text text-transparent">
                        Creators
                    </span>
                </h1>
                <h2 className="text-lg sm:text-xl md:text-2xl font-normal text-neutral-700 mt-1">
                    We are students. But we are pro.
                </h2>
            </div>
        </>
    );
}
