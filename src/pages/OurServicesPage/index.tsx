import { useEffect } from 'react'
import useTitle from '@/hooks/useTitle'
import ServicesHeroSection from '@/pages/OurServicesPage/ServicesHeroSection'
import HighlightedServicesSection from '@/pages/OurServicesPage/HighlightedServicesSection'
import WhyChoosingUsSection from '@/pages/OurServicesPage/WhyChoosingUsSection'
import ServicesGallerySection from '@/pages/OurServicesPage/ServicesGallerySection'

const DESCRIPTION_IMAGES = {
    gallery: {
        feature:
            'https://images.unsplash.com/photo-1479839930473-f4083569cd67?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        top: [
            'https://images.unsplash.com/photo-1566787020216-3e4f973ec5ec?q=80&w=2788&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1521812814624-9571995714fc?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ],
        bottom: [
            'https://images.unsplash.com/photo-1597833406252-d8b1f7ef034d?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1597715186877-69a03e8945c9?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1552959078-f009e3ae920c?q=80&w=2268&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
    },
    banner: 'https://images.unsplash.com/photo-1614607242094-b1b2cf769ff3?q=80&w=2786&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
}

const OurServicesPage = () => {
    useTitle('Stay Mate Hotel | Dịch Vụ')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="-mt-[150px]">
            <ServicesHeroSection />
            <section className="flex flex-col items-center bg-ivory px-5 py-[100px]">
                <HighlightedServicesSection />
            </section>
            <WhyChoosingUsSection featureImageUrl="https://images.unsplash.com/photo-1603090067595-c3febef4765f?q=80&w=2802&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            <section className="flex flex-col items-center bg-ivory px-5 py-[100px]">
                <ServicesGallerySection images={DESCRIPTION_IMAGES} />
            </section>
        </div>
    )
}

export default OurServicesPage
