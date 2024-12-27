import Nav from "@/components/Nav"
import Search_bar from "@/components/Search_bar"

// Home Page Component
const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Search Complaint Information
      </h1>
      <div>
        {/* Pass show_map_btn as a boolean */}
        <Search_bar show_map_btn={true} />
      </div>
    </section>
  )
}

export default Home

