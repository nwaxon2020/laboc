export default function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-6">
              About Laboc Funeral Services
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                For over 25 years, Laboc Funeral Services has been a pillar of support for families during their most difficult times. 
                Our commitment to compassionate care and attention to detail has made us a trusted name in funeral services.
              </p>
              <p>
                Founded in 1995 by the Laboc family, we understand that every family is unique, and every life deserves to be 
                celebrated in a meaningful way. Our experienced team is dedicated to guiding you through every step of the process 
                with empathy and professionalism.
              </p>
              <p>
                We believe in providing affordable, dignified funeral services that honor your loved one's memory while respecting 
                your family's wishes and budget.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-800 mb-2">25+</div>
                <div className="text-gray-600">Years of Service</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-800 mb-2">5000+</div>
                <div className="text-gray-600">Families Served</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-800 mb-2">24/7</div>
                <div className="text-gray-600">Emergency Support</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-800 mb-2">100%</div>
                <div className="text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gray-200 h-96 rounded-lg overflow-hidden">
              {/* Placeholder for image */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🕊️</div>
                  <p className="text-gray-700 text-lg">Compassionate Care Since 1995</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}