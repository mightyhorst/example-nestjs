import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from 'nestjs-config';
import { AuthService } from './auth.service';
import {JwtService} from '@nestjs/jwt';
import { ElasticSearchService, ElasticSearchRequest, ElasticSearchResponse } from '@services/services.module';

class MockJwtService{
    
}

const mockConfig = {
    /** @todo mock config **/
}

describe('Auth Service', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useClass: MockJwtService
                },
                {
                    provide: ConfigService,
                    useValue: mockConfig
                }
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

});
