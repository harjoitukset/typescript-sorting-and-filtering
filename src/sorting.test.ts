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

    test('sorting does not modify the original array', () => {
        sortEventsByStartDate(unordered);

        assert.deepEqual(unordered, [third, first, second]);
    });

    test('sorting may not invoke Array.sort', () => {
        let notAllowed = (compareFn?: ((a: any, b: any) => number)): any[] => {
            throw new Error('Using Array.sort is not allowed in the exercise!');
        };
        jest.spyOn(Array.prototype, 'sort').mockImplementation(notAllowed);

        // this will throw an error if Array.sort is called:
        sortEventsByStartDate(unordered);

        assert.ok(true, 'Array.sort was not called');
    });
});

