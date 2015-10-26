using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Coypu;

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
            var personRow = _session.FindXPath("//tr[td='Tommy']");            

            return _session.FindAllCss("body > table > tbody > tr").Select(r =>
                {   
                    //_session.ExecuteScript(string.Format("document.evaluate({0}, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).innerHTML = '<h2>Hello</h2>';", "//tr[td='Tommy']"));

                    var columns = r.FindAllCss("td");
                    return new ImportantPeopleData
                    {
                        Firstname = columns.Select(c => c.InnerHTML).ToArray()[0],
                        Surname = columns.Select(c => c.InnerHTML).ToArray()[1],
                        DateOfBirth = columns.Select(c => c.InnerHTML).ToArray()[2]
                    };
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
