import { MovingAverageService } from './moving-average.service';

describe('MovingAverageService', () => {
  let service: MovingAverageService;

  beforeEach(() => {
    service = new MovingAverageService(
      { results: [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }, { key: 5 }] },
      'key',
      3
    );
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate moving average correctly', () => {
    const expected = [undefined, undefined, 2, 3, 4];
    const result = service.find();
    expect(result).toEqual(expected);
  });
});
