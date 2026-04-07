const partners = [
  {
    name: 'NY Department of Health',
    logo: 'https://www.health.ny.gov/img/nys_logo.gif',
    alt: 'New York State Department of Health',
  },
  {
    name: 'NY Office for the Aging',
    logo: 'https://aging.ny.gov/sites/default/files/2021-01/NYSOFA_logo.png',
    alt: 'New York State Office for the Aging',
  },
  {
    name: 'Office of the Medicaid Inspector General',
    logo: 'https://omig.ny.gov/sites/default/files/2021-01/OMIG_logo.png',
    alt: 'Office of the Medicaid Inspector General',
  },
];

function Partners() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-sans text-2xl md:text-3xl font-black tracking-widest uppercase text-gray-900 mb-12">
          Our Partners and Certified By
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {partners.map((p) => (
            <div key={p.name} className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
              <img
                src={p.logo}
                alt={p.alt}
                className="h-14 w-auto object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs text-gray-400 tracking-wide">
          Licensed and certified by New York State regulatory agencies
        </p>
      </div>
    </section>
  );
}

export default Partners;
