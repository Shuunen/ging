
const data: Data = {
  groups: [
    {
      title: 'Achat appartement',
      color: 'indigo',
      steps: [
        {
          title: 'visites',
          start: new Date('2022-01-20'),
          days: 150,
        },
        {
          title: 'offre d\'achat',
        },
        {
          title: 'crédit immobilier',
        },
      ],
    },
    {
      title: 'Préparation anniversaire',
      color: 'orange',
      steps: [
        {
          title: 'douche',
          hours: 1,
        },
        {
          title: 'courses',
          hours: 2,
        },
        {
          title: 'cartes / coupons',
          hours: 2,
        },
        {
          title: 'tiramisu',
          hours: 1,
        },
      ],
    },
  ],
}

localStorage.setItem('ging-data', JSON.stringify(data))
