package me.chin.pojo;

public class CoreInternalUser extends InternalUser {
	public CoreInternalUser(Integer uid){
		super(uid);
		System.out.println("CoreInternalUser constructed");
	}
	public String toString() {
		return super.toString();
	}
}
