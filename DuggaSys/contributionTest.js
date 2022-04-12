import {expect} from 'chai';
import {getHoliday} from '../DuggaSYS/contribution.js';

describe('getHoliday', () => {
    
    it('return correct date', () => {
        var d = new date(2022,05,05,05,05,05,00);
        expect(getHoliday(d)).to.equal(4);
    });
    it('return correct date', () => {
        var date = new date(2019,05,05,05,05,05,00);
        expect(getHoliday(d)).to.equal(4);
    });

});