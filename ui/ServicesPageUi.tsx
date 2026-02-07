import Card from '@/components/common/Card'

export default function ServicesPageUi() {
  const services = [
    {
      title: 'Traditional Funerals',
      description: 'Complete funeral services with visitation, ceremony, and burial or cremation options.',
      icon: '🎗️'
    },
    {
      title: 'Cremation Services',
      description: 'Respectful cremation options with memorial services and urn selection assistance.',
      icon: '⚱️'
    },
    {
      title: 'Pre-Planning',
      description: 'Plan ahead to relieve your family of difficult decisions during times of grief.',
      icon: '📋'
    },
    {
      title: 'Grief Support',
      description: 'Counseling and support groups to help families through the grieving process.',
      icon: '🤝'
    },
    {
      title: 'Transportation',
      description: 'Local and long-distance transportation services with dignity and care.',
      icon: '🚗'
    },
    {
      title: 'Memorial Products',
      description: 'Quality caskets, urns, memorial stones, and keepsakes for remembrance.',
      icon: '💎'
    }
  ]

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
            Our Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer comprehensive funeral services designed to honor your loved one with dignity and respect.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}