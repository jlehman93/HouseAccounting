using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GCLHousePayment.Models
{
    public class User
    {
        public string Name { get; set; }
        public List<Item> Items { get; set; }
        public List<Bill> Bills { get; set; }
        
    }
}