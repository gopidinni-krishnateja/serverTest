/**
 * Created by sematic on 15/6/17.
 */
const UserType={
  ADMIN:{code:"ADMIN",value:"Admin"},
  CUSTOMERHELPLINE:{code:"CUSTOMERHELPLINE",value:"CustomerHelpline"},
  TECHNICAL:{code:"TECHNICAL",value:"Technical"}
};
let UserTypeObj={
  values:Object.keys(UserType),
  value(code){
    return UserType[code].code;
  }
};
UserTypeObj=Object.assign(UserType,UserTypeObj);
module.exports=UserTypeObj;
