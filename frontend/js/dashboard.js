const ctx = document.getElementById('chart');

new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Phones','Laptops','Accessories'],
    datasets: [{
      data: [12323, 8534, 2689],

      /* NEW BLUE PALETTE */
      backgroundColor: [
        '#0d6efd',   // strong blue
        '#4da3ff',   // medium blue
        '#a9d0ff'    // light blue
      ],

      borderWidth: 0
    }]
  },
  options:{
    cutout: '65%',   // makes donut nicer & modern
    plugins:{
      legend:{
        position:'bottom',
        labels:{
          usePointStyle:true,
          padding:15
        }
      }
    }
  }
});