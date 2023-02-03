import { filterEventsByStartDate } from "./filtering";
import { sortEventsByStartDate } from "./sorting";
import { getEvents } from "./client";
import { Event } from "./types/Event";

const MILLISECONDS_PER_WEEK = 30 * 24 * 60 * 60 * 1_000;

async function main() {
    let events: Event[] = await getEvents();

    let now = new Date();
    let nextWeek = new Date(now.getTime() + MILLISECONDS_PER_WEEK);

    events = filterEventsByStartDate(events, now, nextWeek);
    printEvents(events);
}

/**
 * Prints the given array of events in ascending order by their start dates.
 */
function printEvents(events: Event[]) {
    let sorted = sortEventsByStartDate(events);

    console.log(`# Events between ${sorted[0].toLocaleString()} and ${sorted[sorted.length - 1].toLocaleString()}`);

    let currentDate = '';
    sorted.forEach(event => {
        let name = getName(event);

        let dateStr = event.event_dates.starting_day;
        let date = dateStr ? new Date(dateStr).toLocaleDateString() : 'no date';
        let time = dateStr ? new Date(dateStr).toLocaleTimeString() : 'no time';

        // date is printed only once before the first event for that day
        if (date !== currentDate) {
            console.log(`\n## ${date}\n`);
            currentDate = date;
        }

        console.log(` * ${time}: ${name}`);
    });
}

/**
 * Returns the first non-empty name for the given event in the following
 * precedence of languages: Finnish, English, Swedish or Chinese.
 */
function getName(event: Event): string {
    let { fi, en, sv, zh } = event.name;
    return fi ?? en ?? sv ?? zh ?? 'no name';
}

main();
