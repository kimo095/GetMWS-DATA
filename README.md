You can access the live page from here:
http://kimo095.github.io/OGC-WMS-Project

//Get capabilites: 
This is a React functional component called GetCapabilities. It fetches and parses the capabilities of a Web Map Service (WMS) and displays a dropdown list of layer names and their abstracts, along with a legend for the selected layer.

The useState hook is used to define the state variables layerNames, layerAbstracts, selectedLayer, and legendUrl, and their corresponding setter functions.

Two useEffect hooks are used. The first one is called only once when the component mounts, and it fetches the WMS capabilities and parses them using an XML parser. The parsed layer names and abstracts are then set using their respective setter functions.

The second useEffect hook is triggered whenever the selectedLayer state variable changes. If selectedLayer is not an empty string, a URL for the legend of the selected layer is constructed and set using the setLegendUrl setter function.

The handleLayerChange function is called whenever the selected layer changes, and it sets the selectedLayer state variable accordingly.

The return statement contains the JSX to be rendered by the component. It includes a select dropdown menu of layer names and abstracts, an img element to display the legend for the selected layer, and some basic HTML formatting. The legend is displayed only if legendUrl is not an empty string.

//Get map //
a React component that renders a map using the Leaflet library and allows the user to select and display different layers on the map. It uses the useState, useRef, and useEffect hooks provided by React to manage component state and lifecycle events.

The component first sets up a useRef hook to create a reference to the Leaflet map component. It also sets up several state variables using the useState hook, including selectedLayers, layerNames, mapLayers, layerOpacity, layerVisibility, and layerOrderAscending.

The component uses the useEffect hook to make an HTTP GET request to retrieve a list of available layers from a WMS server. It then updates the layerNames state variable with this list.

The component also uses the useEffect hook to update the map when the selectedLayers state variable changes. It creates a new Leaflet map instance, adds a base map layer, and then creates new overlay map layers for each selected layer. The layers are added to the map and a layer control is created to allow the user to toggle their visibility. The component also updates the mapLayers state variable with the new layers.

The component provides event handlers for selecting layers and adjusting layer opacity. When a layer is selected, its name is added to or removed from the selectedLayers state variable. When the opacity slider is adjusted, the layerOpacity state variable is updated and the opacity of each layer in the mapLayers array is set to this value.

Overall, this component provides a useful interface for displaying and interacting with multiple layers on a map.
