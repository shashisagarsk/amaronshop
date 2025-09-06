export default function Hero() {
  return (
    <section className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to AmronShop</h1>
        <p className="text-xl md:text-2xl mb-8">Discover amazing products at unbeatable prices</p>
        {/* <Button> को <button> से बदल दिया गया है */}
        <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-md text-lg">
          Shop Now
        </button>
      </div>
    </section>
  )
}