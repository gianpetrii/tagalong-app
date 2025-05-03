import HeroSearch from "@/components/hero-search"
import HowItWorks from "@/components/how-it-works"
import Testimonials from "@/components/testimonials"
import PopularRoutes from "@/components/popular-routes"
import Benefits from "@/components/benefits"
import DownloadApp from "@/components/download-app"
import TrustedCommunity from "@/components/trusted-community"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroSearch />
      <PopularRoutes />
      <HowItWorks />
      <Benefits />
      <TrustedCommunity />
      <Testimonials />
      <DownloadApp />
    </div>
  )
}
