using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Collisions : MonoBehaviour
{
    HashSet<Collider> colliding = new HashSet<Collider>();
    // Start is called before the first frame update
    void Start()
    {
        NewBehaviourScript.registered.Add(this);
    }

    // Update is called once per frame
    void Update()
    {
        
    }

        void OnTriggerEnter(Collider other)
    {
        colliding.Add(other);
        print("Collision in: "+this.gameObject.name+" "+ other);
        print(colliding);
    }

    void OnTriggerExit(Collider other)
    {
        colliding.Remove(other);
        print("Collision out: "+this.gameObject.name+ " "+other);
        print(colliding);
    }

    public string  toString(){ 
        string  result = "{ \"name\":"+"\""+this.gameObject.name+"\""+",\n \"connected\":[";
        if( (name.Contains("Left") || name.Contains("Right")))
            foreach(Collider other in colliding){
                string name = other.gameObject.name;
                if(! (name.Equals("Left") || name.Equals("Right")) && ((name.Contains("Left") || name.Contains("Right"))))
                    result += "\""+other.gameObject.name+"\""+"\n"+",";
            }
            if(result[result.Length - 1]==',')
                result = result.Remove(result.Length - 1);
            return result+"]\n}";
    }
}
