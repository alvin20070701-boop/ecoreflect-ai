export interface EducationTopic {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'clothing' | 'recycle' | 'globe' | 'circle' | 'leaf';
  metrics: { value: string; label: string }[];
  facts: string[];
  impacts: { title: string; desc: string }[];
  sdgMatch: string;
}

export const EDUCATION_TOPICS: EducationTopic[] = [
  {
    id: 'fast-fashion',
    title: 'The Reality of Fast Fashion',
    subtitle: 'Mass production, cheap fabrics, and rapid micro-trends.',
    iconName: 'clothing',
    metrics: [
      { value: '100B', label: 'Garments produced annually' },
      { value: '85%', label: 'Of textile waste goes to landfills' },
      { value: '20%', label: 'Of global clean wastewater contribution' }
    ],
    facts: [
      'The average consumer buys 60% more clothing items than 15 years ago but keeps them for only half as long.',
      'Clothing production doubled between 2000 and 2015, heavily driven by social media micro-trends.',
      'Synthetic fibers like polyester take up to 200 years to decompose in landfill environments.'
    ],
    impacts: [
      {
        title: 'Microplastic Inundation',
        desc: 'Washing synthetic fabrics releases microfibers, contributing over 35% of primary microplastics in our seas.'
      },
      {
        title: 'Water Stress',
        desc: 'Producing a single cotton t-shirt consumes 2,700 liters of freshwater—enough for one person to drink for 2.5 years.'
      }
    ],
    sdgMatch: 'SDG 12.8: Promotes information and lifestyle awareness in harmony with nature.'
  },
  {
    id: 'overconsumption',
    title: 'Confronting Overconsumption',
    subtitle: 'Hyper-promotional shopping events and impulse buying.',
    iconName: 'globe',
    metrics: [
      { value: '5.2-Day', label: 'Average buying gap pre-order' },
      { value: '3x', label: 'Clothing returned and then incinerated' },
      { value: '12%', label: 'Of physical closets are never worn' }
    ],
    facts: [
      'Online "one-click" purchases and personalized social adverts trigger short dopamine bursts leading to impulse checkout.',
      'Return shipments create heavy carbon emissions, as returns are frequently discarded or burned due to reprocessing costs.',
      'An estimated 64% of items in closets are worn less than 5 times before storage or disposal.'
    ],
    impacts: [
      {
        title: 'Logistics Footprint',
        desc: 'The shipping, packaging, and return chains contribute heavily to localized diesel pollution in urban density centers.'
      },
      {
        title: 'Land Exploitation',
        desc: 'Clearing forests for livestock leather or cellulosic fabrics (rayon/viscose) accelerates worldwide topsoil erosion.'
      }
    ],
    sdgMatch: 'SDG 12.8 & 12.2: Focuses on achieving the sustainable management and efficient use of natural resources.'
  },
  {
    id: 'circular-economy',
    title: 'Exploring the Circular Economy',
    subtitle: 'De-coupling growth from pristine material extraction.',
    iconName: 'circle',
    metrics: [
      { value: '98%', label: 'Potential textile recycle rate' },
      { value: '10x', label: 'Life extension via direct repair' },
      { value: '30M', label: 'Tons of clothing swapped annually' }
    ],
    facts: [
      'A circular economy aims to eliminate environmental waste by designing fabrics that can be fully re-extracted and spun back into yardage.',
      'Instead of the Take-Make-Waste model, circularity operates on Rent-Wear-Return, Repair-Extend, and Recycle.',
      'Less than 1% of current worn materials are recycled into premium-grade new garments.'
    ],
    impacts: [
      {
        title: 'Extended Lifecycle',
        desc: 'Keeping garments active for just 9 unnecessary months reduces carbon, water, and waste footprints by 20-30%.'
      },
      {
        title: 'Resource Savings',
        desc: 'Reclaimed fibers require 80% less nitrogen and water reserves compared to processing virgin cotton wool.'
      }
    ],
    sdgMatch: 'SDG 12.5: Substantially reduces waste generation through prevention, reduction, recycling, and reuse.'
  },
  {
    id: 'sdg-128',
    title: 'Understanding UN SDG 12.8',
    subtitle: 'Responsible consumption starts with conscious knowledge.',
    iconName: 'leaf',
    metrics: [
      { value: '193', label: 'United Nations Member states' },
      { value: '2030', label: 'Target timeline for goals' },
      { value: '1st', label: 'Priority for digital wellness' }
    ],
    facts: [
      'SDG 12.8 is the global mandate for sustainability information: ensuring global citizens hold correct awareness for sustainable development.',
      'It bridging the information gap, converting raw transactional numbers into mindful lifestyle modifications.',
      'Technology plays a heroic role here by using data analytics and artificial intelligence to highlight duplicate purchasing patterns.'
    ],
    impacts: [
      {
        title: 'Citizen Empowerment',
        desc: 'Giving consumers visibility into duplicate shopping triggers deep behavioral shifts and accountability.'
      },
      {
        title: 'Systemic Transformation',
        desc: 'Consolidated demand for ethical products forces apparel houses to shift away from low-quality fast fashion models.'
      }
    ],
    sdgMatch: 'SDG 12.8: The direct foundation for EcoReflect AI’s behavioral dashboard and coaching assistant.'
  }
];
