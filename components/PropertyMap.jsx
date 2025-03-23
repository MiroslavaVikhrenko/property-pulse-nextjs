'use client';
import { useEffect, useState } from "react";
import { setDefaults, fromAddress } from "react-geocode";
import Map, { Marker } from 'react-map-gl';
//import {Map, Marker } from "mapbox-gl";
import Image from 'next/image';
import pin from '@/assets/images/pin.svg';
import Spinner from "./Spinner";

const PropertyMap = ({property}) => {
    // Get latitude => 
    // we need to take property address, run it through function fromAddress() that comes with react-geocode
    // and get latitude and longitude so that we can place it on the map

    // Create STATE VALUES => latitude and longitude are going to go in the state
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    // Viewport with properties (0 by default) zoom = zoom level
    const [viewport, setViewport] = useState({
        latitude: 0,
        longitude: 0,
        zoom: 12,
        width: '100%',
        height: '500px'
    });
    // Loading state => true by default => once we fetch latitude and longitude we'll set it to false
    const [loading, setLoading] = useState(true);
    // Geocode error => false by default
    const [geocodeError, setGeocodeError] = useState(false);

    // Add Google Geocoding API Key
    setDefaults({
        key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
        language: 'en',
        region: 'us'
    });

    // useEffect() => to make request using fromAddress() to get latitude using property address (city, state, street...)
    // useEffect() runs when the component mounts    
    useEffect(() => {
        const fetchCoords = async () => {
            try {
                // Make the request (and get the response) => fromAddress() takes an address
                const res = await fromAddress(`${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`);

                // Check geocode results array length => if 0 = no results
                if (res.results.length === 0) {
                    setGeocodeError(true);
                    return;
                }

                // If there is a result => then I want to destructure latitude and longitude from response result
                // geometry object, location object => that's what has latitude and longitude 
                const {lat, lng} = res.results[0].geometry.location
                //console.log(lat, lng);

                // Set that in the state
                setLat(lat);
                setLng(lng);
                setViewport({
                    ...viewport, // spread current viewport
                    latitude: lat,
                    longitude: lng
                });

            } catch (error) {
                console.log(error);
                setGeocodeError(true);
            } // Add "finally" because I want to make sure that I set loading to false no matter what
            finally{
                setLoading(false);
            }
        }

        fetchCoords();
    }, []);

    // Check to see if loading is true => if true, return for now h3
    if (loading) return <Spinner />;

    // Check for error
    if (geocodeError) return <div className="text-xl">No location data found</div>;

    return (
        !loading && (
          <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            mapLib={import('mapbox-gl')}
            initialViewState={{
              longitude: lng,
              latitude: lat,
              zoom: 15,
            }}
            style={{ width: '100%', height: 500 }}
            mapStyle='mapbox://styles/mapbox/streets-v9'
          >
            <Marker longitude={lng} latitude={lat} anchor='bottom'>
              <Image src={pin} alt='location' width={40} height={40} />
            </Marker>
          </Map>
        )
      );
};
 
export default PropertyMap;