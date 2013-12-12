package me.chin.pojo;

public class InternalUser extends User {
	
	public InternalUser(Integer uid){
		super(uid);
		System.out.println("InternalUser constructed");
	}
}
