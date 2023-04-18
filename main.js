import './style.css'
import { get_data, get_wo_ref } from './composable/getData';
import Chart from 'chart.js/auto';


let grouped_workouts = new Map();
let wo_ref = null;

get_wo_ref().then(json => {
  wo_ref = JSON.parse(json.data);
  wo_ref.forEach(ele => {
    let html = `<details class="workout_nav"><summary>${ele.id.replace('fbm', 'Month ').replace("d", " Day ")}</summary><ul>`;
    ele.workouts.forEach(wo => {
        html += `<li id="${wo.id}" class="list"><h4>${wo.name.toUpperCase().replace('_', ' ')}</h4></li>`;
    });

    html += '</ul></details>'
    $("aside").append(html);    
  });
  $('li').each(function(){
    $(this).on('click', function() {
      $("#chart").replaceWith('<canvas id="chart"></canvas>');
      let wo_history = grouped_workouts.get($(this).attr('id'));
      const ctx = document.getElementById('chart');

      let labels = Array.from(new Set(wo_history.map(ele => ele.date)));
      let grouped_weights = new Map();
      wo_history.forEach(his => {
        if (grouped_weights.has(his.date)) {
          let val = grouped_weights.get(his.date);
          val.push(his.weight);
        } else {
          grouped_weights.set(his.date, [his.weight])
        }
      })
      let data = []
      grouped_weights.forEach((v,k) => {
        data.push(v[v.length -2]);
      });
      
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Weight used',
            data: data,
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
      });
    }).on('click', function() {
      $(".active").removeClass('active');
      $(this).addClass('active')
    })
  })
});
get_data(format_data);

function format_data(docs) {
  docs.forEach(wo => {
    if (!grouped_workouts.has(wo.workout_id)) {
      grouped_workouts.set(wo.workout_id, [wo]);
    } else {
      let val = grouped_workouts.get(wo.workout_id);
      val.push(wo);
      val = val.sort((a,b) => a.created_on.seconds - b.created_on.seconds);
      grouped_workouts.set(wo.workout_id, val);
    }
  });
}



document.querySelector('body').addEventListener('click', ()=>console.log(grouped_workouts))


// {
//   "alt_name": "",
//   "workout_id": "0cd31bb6-411b-4a37-aeff-0cf0f21782f8",
//   "notes": "",
//   "rpe": "9.5",
//   "date": "1/26/2023 - Thursday",
//   "created_on": {
//       "seconds": 1674776676,
//       "nanoseconds": 628000000
//   },
//   "type": "working",
//   "order": 0,
//   "weight": "95",
//   "reps": "8",
//   "id": "02VjCkGvPW4DQAlwz37W"
// }