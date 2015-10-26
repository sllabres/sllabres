using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Coypu;
using System.Text.RegularExpressions;

namespace ITGuys.Tests.PageObjects
{
    public class ITGuysPage
    {
        private readonly BrowserSession _session;

        public ITGuysPage(BrowserSession session)
        {
            _session = session;
        }

        public string GetHeading()
        {
            return _session.FindCss("h1").InnerHTML;            
        }

        public string GetSubHeading()
        {
            return _session.FindCss("h2").InnerHTML;
        }
                
        public IEnumerable<ImportantPeopleData> GetImportantPeople()
        {
            return _session.FindAllCss("body > table > tbody > tr").Select(r =>
                {
                    var columns = r.FindAllCss("td");
                    var importantPerson = new ImportantPeopleData
                    {
                        Firstname = columns.Select(c => c.InnerHTML).ToArray()[0],
                        Surname = columns.Select(c => c.InnerHTML).ToArray()[1],
                        DateOfBirth = columns.Select(c => c.InnerHTML).ToArray()[2]
                    };

                    _session.ExecuteScript(string.Format("$(_x(\"//tr[td='{0}']\")).attr('style', 'background-color: green;');", importantPerson.Firstname));

                    return importantPerson;
                }).ToList();            
        }        
    }

    public class ImportantPeopleData
    {
        public string Firstname { get; set; }
        public string Surname { get; set; }
        public string DateOfBirth { get; set; }
    }

    public class NullImportantPeopleData : ImportantPeopleData
    {
    }

    public class ImportantPeopleStore
    {
        private IEnumerable<ImportantPeopleData> _importantPeople;

        public ImportantPeopleStore(IEnumerable<ImportantPeopleData> importantPeople)
        {
            _importantPeople = importantPeople;
        }

        public ImportantPeopleData GetImportantPerson(string firstName, string surname)
        {
            return _importantPeople.FirstOrDefault(x => x.Firstname == firstName && x.Surname == surname) ?? new NullImportantPeopleData();
        }
    }
}
