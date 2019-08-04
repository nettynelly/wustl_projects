function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_endpoint = '/metadata/' + sample;
    d3.json(sample_endpoint)
      .then(function(response){
        // console.log('response:', response);
        // We do stuff with the data the comes back from the API
        // Target the METADATA element so that we can populate it with the gathered info
        var metaDataElement = d3.select('#sample-metadata');

        // Use `.html("") to clear any existing metadata
        metaDataElement.html("");
    
        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        // console.log('Object entries:', Object.entries(response));
        Object.entries(response).forEach(function([key, value]) {
          var text = key + ': ' + value;
          metaDataElement.append('p').text(text);
        })

        // BONUS: Build the Gauge Chart, uncomment when ready to test
        // buildGauge(response.WFREQ);
      })

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var sample_endpoint = '/samples/' + sample;
    d3.json(sample_endpoint)
      .then(function(response) {
        // @TODO: Build a Bubble Chart using the sample data
        console.log('[buildCharts] response:', response);
        // Grab our 3 lists of information separately
        var labels = response['otu_labels'];
        var values = response['otu_ids'];
        var size = response['sample_values'];

        // Create a 'payload' to feed to the chart function
        var bubbleChartData = [
          {
            'x': values,
            'y': size,
            'text': labels,
            'mode': 'markers',
            'marker': {
              size: size,
              color: values
            }
          }
        ];

        // Create a layout for the bubble chart
        var bubbleChartLayout = {
          'xaxis': { 'title': 'OTU IDS'},

        }

        // build the bubble chart
        Plotly.plot('bubble', bubbleChartData, bubbleChartLayout);

        // @TODO: Build a Pie Chart
        // HINT: You will need to use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).
        var ten_sample_values = values.slice(0, 10);
        var ten_labels = labels.slice(0, 10);
        var ten_size = size.slice(0, 10);

        var pie_data = [
          {
            values: ten_size,
            labels: ten_sample_values,
            hovertext: ten_labels,
            hoverinfo: 'hovertext',
            type: 'pie'
          }
        ];

        Plotly.plot('pie', pie_data, { margin: { t: 0, l: 0 } });
        
      })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
