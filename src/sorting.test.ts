import { test, describe, expect } from '@jest/globals';
import { strict as assert } from 'node:assert';
import { Event } from './types/Event';
import { sortEventsByStartDate } from './sorting';

function createTestEvent(startingDay?: string): Event {
    return {
        name: {},
        description: {},
        event_dates: {
            starting_day: startingDay
        }
    };
}

describe('sorting events by starting date', () => {
    const first: Event = createTestEvent('2024-12-31T16:00:00.000Z');
    const second: Event = createTestEvent('2025-01-05T16:00:00.000Z');
    const third: Event = createTestEvent('2025-01-10T16:00:00.000Z');

    const unordered = [third, first, second];

    test('events are sorted in correct order', () => {
        let sorted = sortEventsByStartDate(unordered);

        assert.deepEqual(sorted, [first, second, third]);
    });

    test('sorting handles events with identical dates correctly', () => {
        let unorderedTwice = [...unordered, ...unordered];
        let sorted = sortEventsByStartDate(unorderedTwice);

        assert.deepEqual(sorted, [first, first, second, second, third, third]);
    });

    test('sorting does not modify the original array', () => {
        sortEventsByStartDate(unordered);

        assert.deepEqual(unordered, [third, first, second]);
    });

    test('sorting is not allowed to utilize Array.sort', () => {
        let notAllowed = (compareFn?: ((a: any, b: any) => number)): any[] => {
            throw new Error('Using Array.sort is not allowed in the exercise!');
        };
        jest.spyOn(Array.prototype, 'sort').mockImplementation(notAllowed);

        // if Array.sort is called inside the function, an error will be thrown
        sortEventsByStartDate(unordered);

        assert.ok(true, 'Array.sort was not called');
    });
});

