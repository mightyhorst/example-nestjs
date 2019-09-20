import { Test, TestingModule } from '@nestjs/testing';
import {BodyBuilderFactory, IBodyBuilderRequest} from './bodybuilder.decorator';
import { Request } from 'jest-express/lib/request';

describe('bodybuilder decorator', () => {

    let request: Request;

    afterEach(() => {
        request.resetMocked();
    });

    it('should add a size query if the query string did contain a `size` parameter', () => {
        request = new Request('/api/v2/foobar');
        request.setQuery('size', '5');

        BodyBuilderFactory(null, request);

        const query: any = (<IBodyBuilderRequest>request).bodybuilder.build();
        expect(query).toHaveProperty('size');
        expect(query.size).toEqual('5');
    });

    it('should add a model query if the query string did contain a `model` parameter', () => {
        request = new Request('/api/v2/foobar');
        request.setQuery('model', 'HP EliteBook');

        BodyBuilderFactory(null, request);

        const query: any = (<IBodyBuilderRequest>request).bodybuilder.build();
        const expectation = {
            "query": {
                "match": {
                    "model": "HP EliteBook"
                }
            }
        };
        expect(query).toHaveProperty('query');
        expect(query).toEqual(expectation);
    });

    it('should add a `form_factor` query if the query string did contain a `formfactor` parameter', () => {
        request = new Request('/api/v2/foobar');
        request.setQuery('formfactor', 'Laptop');

        BodyBuilderFactory(null, request);

        const query: any = (<IBodyBuilderRequest>request).bodybuilder.build();
        const expectation = {
            "query": {
                "match": {
                    "form_factor": "Laptop"
                }
            }
        };
        expect(query).toHaveProperty('query');
        expect(query).toEqual(expectation);
    });


    it('should add a `release_year` range if the query string did contain an `age` parameter', () => {
        request = new Request('/api/v2/foobar');
        request.setQuery('age', '1y');

        BodyBuilderFactory(null, request);

        const query: any = (<IBodyBuilderRequest>request).bodybuilder.build();
        const expectation = {
            "query": {
                "range": {
                    "release_year": {
                        "lte": "now-1y"
                    }
                }
            }
        };
        expect(query).toHaveProperty('query');
        expect(query).toEqual(expectation);
    });

    it('should still generate a valid query if given two criteria', () => {
        request = new Request('/api/v2/foobar');
        request.setQuery('age', '1y');
        request.setQuery('model', 'HP EliteBook');

        BodyBuilderFactory(null, request);

        const query: any = (<IBodyBuilderRequest>request).bodybuilder.build();
        const expectation = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "model": "HP EliteBook" } },
                        { "range": { "release_year": {"lte": "now-1y"} }}
                    ]
                }
            }
        };
        expect(query).toHaveProperty('query');
        expect(query).toEqual(expectation);
    });
});