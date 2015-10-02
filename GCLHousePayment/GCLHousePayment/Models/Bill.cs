using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GCLHousePayment.Models
{
    public class Bill
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public List<Item> Items { get; set; }
        public double totalPrice { get; set; }

        public User Owner { get; set; }
    }
}