/**
 * "The MyHelsinki Open API (application programming interface) is an open interface
 * of three databases maintained by City of Helsinki. The API offers up-to-date
 * information about places, events and activities in and around Helsinki.
 * With this API we hope to increase the usage of open data for both commercial purposes
 * and the city’s development. It can be used by experienced project development teams
 * and new app developers alike.
 *
 * All of the information provided over the API is open data with the exception of image
 * files. When using images, please refer to the license terms included with each image.
 * The MyHelsinki Open API has been developed in collaboration with Futurice."
 *
 * @see https://open-api.myhelsinki.fi/doc
 * @see https://open-api.myhelsinki.fi/terms
 */

import { Event } from "./types/Event";
import fetch from "node-fetch";

type HelsinkiApiResponse<T> = {
    data: T[];
};

export async function getEvents(): Promise<Event[]> {
    let response = await fetch('https://open-api.myhelsinki.fi/v1/events/');
    let json = await response.json() as HelsinkiApiResponse<Event>;
    return json.data;
}