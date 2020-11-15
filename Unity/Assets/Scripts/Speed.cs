using System.Collections;  
using System.Collections.Generic;  
using UnityEngine;  
  
public class Speed : MonoBehaviour  
{  
    Vector3 Vec; 
    bool isClicked;
    // Start is called before the first frame update  
    
    void Start()  
    {  
          isClicked = false;
    }  
  
    // Update is called once per frame  
    void Update()  
    {  
        if(isClicked){
        Vec = transform.localPosition;  
        Vec.x += Input.GetAxis("Horizontal") * Time.deltaTime * 20;  
        Vec.z += Input.GetAxis("Vertical") * Time.deltaTime * 20;  
        transform.localPosition = Vec;  
        }
    }

     void OnMouseDown(){
          print("Click");
          if(isClicked){
            isClicked=false;
          }
          else{
              isClicked=true;
          }
    }
} 