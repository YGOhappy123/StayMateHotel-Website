import { useEffect } from 'react'
import useTitle from '@/hooks/useTitle'
import StatisticSection from '@/pages/HomePage/StatisticSection'
import HomeHeroSection from '@/pages/HomePage/HomeHeroSection'
import DescriptionSection from '@/pages/HomePage/DescriptionSection'
import GallerySection from '@/pages/HomePage/GallerySection'
import WhyChoosingUsSection from '@/pages/OurServicesPage/WhyChoosingUsSection'

const HomePage = () => {
    useTitle('Stay Mate Hotel | Trang Chủ')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="-mt-[150px]">
            <HomeHeroSection />
            <StatisticSection />
            <DescriptionSection />
            <WhyChoosingUsSection featureImageUrl="https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            <GallerySection />
        </div>
    )
}

export default HomePage
