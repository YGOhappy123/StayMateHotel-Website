const StatisticSection = () => {
    return (
        <section className="flex justify-center bg-accent px-5 py-[50px]">
            <div className="grid w-full max-w-container grid-cols-2 gap-8 font-serif text-ivory xl:grid-cols-4">
                <div className="flex flex-col items-center gap-5">
                    <span className="text-5xl font-semibold">
                        125<sup className="ml-3 text-2xl">+</sup>
                    </span>
                    <span className="text-xl font-semibold capitalize">Phòng Khách Sạn</span>
                </div>
                <div className="flex flex-col items-center gap-5">
                    <span className="text-5xl font-semibold">
                        10th<sup className="ml-3 text-2xl">+</sup>
                    </span>
                    <span className="text-xl font-semibold capitalize">Top Khách Sạn 2024</span>
                </div>
                <div className="flex flex-col items-center gap-5">
                    <span className="text-5xl font-semibold">
                        6k<sup className="ml-3 text-2xl">+</sup>
                    </span>
                    <span className="text-xl font-semibold capitalize">Khách Hàng Mỗi Năm</span>
                </div>
                <div className="flex flex-col items-center gap-5">
                    <span className="text-5xl font-semibold">
                        2k<sup className="ml-3 text-2xl">+</sup>
                    </span>
                    <span className="text-xl font-semibold capitalize">Lượt Thuê Mỗi Năm</span>
                </div>
            </div>
        </section>
    )
}

export default StatisticSection
