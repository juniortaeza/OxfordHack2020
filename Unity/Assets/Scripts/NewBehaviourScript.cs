using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using UnityEngine.Networking;

public class NewBehaviourScript : MonoBehaviour
{
    public static HashSet<Collisions> registered = new HashSet<Collisions>();

        void Start()  
    {  

    }  
  
    // Update is called once per frame  
     async void OnMouseDown(){
         string result="[";
         foreach(Collisions collision in registered)
            result += collision.toString()+",";
        result = result.Remove(result.Length - 1);
        result+="]";
        print(result);
        var data = new StringContent(result, Encoding.UTF8, "application/json");

        var url = "https://task-manager-by-arnab-ap.herokuapp.com/test";
        var client = new HttpClient();

        var response = await client.PostAsync(url, data);

        string resultServer = response.Content.ReadAsStringAsync().Result;
        print("Server" + resultServer);

        // WWWForm form = new WWWForm();
        // form.AddField("json", result);
        // var www = UnityWebRequest.Post("https://task-manager-by-arnab-ap.herokuapp.com/test", form);
        // www.SendWebRequest();

        // if (www.isNetworkError || www.isHttpError)
        // {
        //     print(www.error);
        // }
        // else
        // {
        //     print("Form upload complete!");
        // }
     }
}
