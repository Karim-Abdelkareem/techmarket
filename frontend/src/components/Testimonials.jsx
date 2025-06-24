const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Michael Brown',
      role: 'Creative Lead',
      image: 'https://placehold.co/100/1e293b/ffffff?text=MB',
      content: "Svarog's blend of flexibility and deep expertise has been invaluable. Their ability to adapt to our evolving needs while delivering exceptional design has made them an essential partner.",
    },
    {
      id: 2,
      name: 'James Lee',
      role: 'Brand Strategist',
      image: 'https://placehold.co/100/1e293b/ffffff?text=JL',
      content: "Svarog brought our brand vision to life with their exceptional design skills and innovative approach. Their creative solutions helped us stand out in a crowded market.",
    },
    {
      id: 3,
      name: 'Jane Doe',
      role: 'Marketing Director',
      image: 'https://placehold.co/100/1e293b/ffffff?text=JD',
      content: "Working with Svarog was a game-changer for our brand. Their design team delivered creative solutions that perfectly captured our vision. 👍👍👍",
    },
    {
      id: 4,
      name: 'Emily Johnson',
      role: 'Product Manager',
      image: 'https://placehold.co/100/1e293b/ffffff?text=EJ',
      content: "The team at Svarog consistently exceeded our expectations with their high-quality designs and timely delivery. Their work has significantly enhanced our product. 🔥",
    },
  ];

  return (
    <div className="py-16 px-6 bg-dark">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">What our clients say about us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-300 mb-6">{testimonial.content}</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-white font-medium">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;