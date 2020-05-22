// Use D3 to read the JSON file
d3.json("samples.json").then((dData) => { // this is calling our json file and a "then" command. Then() function is related to "Javascript promises"
                                          // that are used in some libraries or frameworks like jQuery or AngularJS.
    window.bbData = dData;               //The window object is supported by all browsers. It represents the browser's window.
                                          //All global JavaScript objects, functions, and variables automatically become members of the window object.
    console.log(dData);                  //console log the dDate which is our callback we created with our .then() function
    var data = dData;                   //Create a variable with our callback json file. 
  
    // Add ID#s to dropdown menu
    var idList = data.names; //creating a variable pulling the variable the names out from the data variable we created above 
    for (var i = 0; i < idList.length; i++) { //a 'for' loop starting with the first index (0), where 'i' must loop through the 'idList' array
      selectBox = d3.select("#selDataset");   //this is creating the selectbox function, it can be recalled in our html with the #selDataset
      selectBox.append("option").text(idList[i]); // '.append().Inserts content at the end of the selected elements.
    }
  

    
    // Set up default plot
    Plots(0)
  
    // Function for updating plots   
    function Plots(index) {
  
  
      // Set up arrays for horizontal bar chart & gauge chart
      var sampleSubjectOTUs = data.samples[index].otu_ids; 
      console.log(sampleSubjectOTUs);
      var sampleSubjectFreq = data.samples[index].sample_values;
      var otuLabels = data.samples[index].otu_labels //creating variables to call our json data and to make it an array, it will be called down below
                                                    //when we make our top ten list
  
      var washFrequency = data.metadata[+index].wfreq; //the + turns the array into numberic data. This is used for the gauge
      console.log(washFrequency); //simple console log 
  
  
      // Populate Demographic Data card
      var demoKeys = Object.keys(data.metadata[index]); //the keys within the metadata index
      var demoValues = Object.values(data.metadata[index]) //values of the metadata index
      var demographicData = d3.select('#sample-metadata'); //created a class to call our objects values 
  
      // clear demographic data
      demographicData.html(""); 
  
      for (var i = 0; i < demoKeys.length; i++) {
  
        demographicData.append("p").text(`${demoKeys[i]}: ${demoValues[i]}`); // this will append all the paragraph values in the html text box and will 
                                                                              //will allow for the data to be cleared 
      };
  
  
      // Slice and reverse data for horizontal bar chart
      var topTenOTUS = sampleSubjectOTUs.slice(0, 10).reverse();
      var topTenFreq = sampleSubjectFreq.slice(0, 10).reverse();
      var topTenToolTips = data.samples[0].otu_labels.slice(0, 10).reverse();
      var topTenLabels = topTenOTUS.map((otu => "OTU " + otu)); //creates our label to our data 
      var reversedLabels = topTenLabels.reverse(); //creating our top ten list from our arrays from above. We use the .slice and .reverse commands
  
      // Set up trace
      var trace1 = {
        x: topTenFreq,
        y: reversedLabels,
        text: topTenToolTips,
        name: "",
        type: "bar",
        orientation: "h"
      };
  //This is creating the horizontial bar chart
      // data
      var barData = [trace1]; //putting that chart into a variable we can callback later 
  
      // Apply  layout
      var layout = {
        title: "Top 10 OTUs",
        margin: { //creating the margin on the html page
          l: 75,
          r: 75,
          t: 75,
          b: 50
        }  //This is laying out where the bar chart will be located on the webpage
      };
 
      // Render the plot to the div tag with id "plot"
      Plotly.newPlot("bar", barData, layout); //using Plotly command to plot the bar chart
  
      // Set up trace
      trace2 = {
        x: sampleSubjectOTUs,
        y: sampleSubjectFreq,
        text: otuLabels,
        mode: 'markers',
        marker: {
          color: sampleSubjectOTUs,
          opacity: [1, 0.8, 0.6, 0.4],
          size: sampleSubjectFreq
        }
      }
        //creating our buble chart, similar steps as above for the horizontial bar chart 
      //data
      var bubbleData = [trace2];
  
      // Apply layout
      var layout = {
        title: 'OTU Frequency',
        showlegend: false,
        height: 600,
        width: 930
      }
  
      // Render the plot to the div tag with id "bubble-plot"
      Plotly.newPlot("bubble", bubbleData, layout)
  
      // Gauge chart
  
      var trace3 = [{
        domain: {x: [0, 1], y: [0,1]},
        type: "indicator",
        mode: "gauge+number",
        value: washFrequency,
        title: { text: "Belly Button Washes Per Week" },
        gauge: {
          axis: { range: [0, 9], tickwidth: 0.5, tickcolor: "black" },
          bar: { color: "#669999" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "transparent",
          steps: [
            { range: [0, 1], color: "#fff" },
            { range: [1, 2], color: "#e6fff5" },
            { range: [2, 3], color: "ccffeb" },
            { range: [3, 4], color: "b3ffe0" },
            { range: [4, 5], color: "#99ffd6" },
            { range: [5, 6], color: "#80ffcc" },
            { range: [6, 7], color: "#66ffc2" },
            { range: [7, 8], color: "#4dffb8" },
            { range: [8, 9], color: "#33ffad" }
  
          ],
        }
      }]; //creating a our gauge. This gauge calls out how many times a week our patient wash their bully button. Not as complicated as you think.
  
      gaugeData = trace3;
  
      var layout = {
        width: 600,
        height: 500,
        margin: { t: 0, b: 0 }
      };
  
      Plotly.newPlot("gauge", gaugeData, layout);
  
    } //Just like our other graphs, it's a three part process; (trace, create variable for plot, create layout, and use Plotly to plot)
  
    // On button click, call refreshData()
    d3.selectAll("#selDataset").on("change", freshData); //an .on command will change our data when it's selected.It will change according to
    //our 'freshdata' function down below
  
  
  
    function freshData() {
      var dropdownMenu = d3.select("#selDataset");
      // Assign the value of the dropdown menu option to a variable
      var personsID = dropdownMenu.property("value");
      console.log(personsID);
      
      
      
      // Initialize an empty array for the person's data
      console.log(data)
  
      for (var i = 0; i < data.names.length; i++) {
        if (personsID === data.names[i]) {
          Plots(i);
          return
        }
      }
    }
  
  });